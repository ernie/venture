defmodule Venture.ChannelMonitor do
  use GenServer

  ## Client API

  def monitor(server_name, pid, mfa) do
    GenServer.call(server_name, {:monitor, pid, mfa})
  end

  def demonitor(server_name, pid, mfa) do
    GenServer.call(server_name, {:demonitor, pid, mfa})
  end

  ## Server Callbacks

  def start_link(name) do
    GenServer.start_link(__MODULE__, :ok, name: name)
  end

  def init(:ok) do
    {:ok, %{channels: %{}}}
  end

  def handle_call({:monitor, pid, mfa}, _from, state) do
    ref = Process.monitor(pid)
    {:reply, :ok, put_channel(state, pid, {ref, mfa})}
  end

  def handle_call({:demonitor, pid}, _from, state) do
    case Map.fetch(state.channels, pid) do
      :error      -> {:reply, :ok, state}
      {:ok, {ref, _mfa}} ->
        Process.demonitor(ref)
        {:reply, :ok, drop_channel(state, pid)}
    end
  end

  def handle_info({:DOWN, ref, :process, pid, _reason}, state) do
    Process.demonitor(ref)
    case Map.fetch(state.channels, pid) do
      :error                   -> {:noreply, state}
      {:ok, {_ref, {mod, func, args}}} ->
        Task.Supervisor.start_child(Venture.TaskSupervisor, mod, func, args)
        {:noreply, drop_channel(state, pid)}
    end
  end

  defp drop_channel(state, pid) do
    %{state | channels: Map.delete(state.channels, pid)}
  end

  defp put_channel(state, pid, {ref, mfa}) do
    %{state | channels: Map.put(state.channels, pid, {ref, mfa})}
  end

end
