defmodule Venture.Nicks do
  use GenServer

  alias Venture.Nick

  ## Client API

  def start_link(_opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def put(socket, name) do
    GenServer.call(__MODULE__, {:put, socket, name})
  end

  def socket(name) do
    GenServer.call(__MODULE__, {:socket, name})
  end

  def delete(id) do
    GenServer.call(__MODULE__, {:delete, id})
  end

  def reset do
    GenServer.call(__MODULE__, {:reset})
  end

  def all do
    GenServer.call(__MODULE__, {:all})
  end

  ## Server Callbacks

  def init(:ok) do
    {:ok, %{taken: %{}, nicks: %{}}}
  end

  def handle_call({:reset}, _from, _state) do
    {:reply, :ok, %{taken: %{}, nicks: %{}}}
  end

  def handle_call({:put, %Phoenix.Socket{id: id}, nil}, _from, state) do
    taken = case Map.fetch(state.nicks, id) do
      {:ok, %Nick{name: nil}}  -> state.taken
      {:ok, %Nick{name: name}} -> Map.delete(
                                    state.taken, String.downcase(name)
                                  )
      :error                   -> state.taken
    end
    nicks = Map.put(state.nicks, id, %Nick{id: id, name: nil})
    {
      :reply,
      {:ok, nil},
      %{ state | taken: taken, nicks: nicks }
    }
  end

  def handle_call({:put, socket, name}, _from, state) do
    processed = preprocess(name)
    case valid_name?(processed) do
      true -> do_put(processed, socket, state)
      false ->
        {:reply, {:error, "Nickname contains invalid characters."}, state}
    end
  end

  def handle_call({:socket, name}, _from, state) do
    case Map.fetch(state.taken, String.downcase(name)) do
      {:ok, socket} -> { :reply, socket, state }
      :error        -> { :reply, nil, state }
    end
  end

  def handle_call({:delete, id}, _from, state) do
    {deleted_name, taken} = case Map.fetch(state.nicks, id) do
      {:ok, %Nick{name: nil}}  -> { nil, state.taken }
      {:ok, %Nick{name: name}} ->
        { name, Map.delete(state.taken, String.downcase(name)) }
      :error                   -> { nil, state.taken }
    end
    nicks = Map.delete(state.nicks, id)
    {
      :reply,
      deleted_name,
      %{ state | taken: taken, nicks: nicks }
    }
  end

  def handle_call({:all}, _from, state) do
    {:reply, Map.values(state.nicks), state}
  end

  defp do_put(name, _socket, state)
       when byte_size(name) > 16 or byte_size(name) < 1
  do
    {:reply, {:error, "Nickname must be between 1 and 16 bytes long."}, state}
  end

  defp do_put(name, socket = %{id: id}, state) do
    case Map.fetch(state.taken, String.downcase(name)) do
      {:ok, %{id: existing_id}} when existing_id != id ->
        {:reply, {:error, "'#{name}' is already taken."}, state}
      _ ->
          taken = case Map.fetch(state.nicks, id) do
            :error -> Map.put(state.taken, String.downcase(name), socket)
            {:ok, _existing = %Nick{name: nil}} ->
               Map.put(state.taken, String.downcase(name), socket)
            {:ok, existing} -> Map.delete(
                                 state.taken, String.downcase(existing.name)
                               ) |> Map.put(String.downcase(name), socket)
          end
          nicks = Map.put(
            state.nicks, id, %Nick{id: id, name: name}
          )
          {
            :reply,
            {:ok, name},
            %{ state | taken: taken, nicks: nicks }
          }
    end
  end

  defp preprocess(name) do
    name
    |> String.trim
    |> String.replace(~r{\s+}, " ")
  end

  defp valid_name?(name) do
    !String.contains?(name, ["'", "\""])
  end

end
