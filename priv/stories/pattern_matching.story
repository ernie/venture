---

---
## Pattern matching
```elixir
  def complex_function(thing) do
    case thing do
      {one, two} ->
        IO.puts("its a two element tuple with #{one} and #{two}")
      [one, two, three] ->
        IO.puts("its a list with #{one} and #{two} and #{three}")
      _ ->
        IO.puts("I don't care what it is.")
    end
  end
```
\\\\\\\\\\\
## Pattern matching in function dispatch
```elixir
  def two_headed_function(map = %{a: a}) do
    IO.puts("I got a map with an a: #{a}")
    IO.inspect(map)
  end

  def two_headed_function({one, two}) do
    IO.puts("I got a two tuple with: #{one} and #{two}")
  end
```
\\\\\\\\\\\
---
next: main:8
---
## The pipeline operator
```elixir
  def pipeline_example do
    "string" |> String.capitalize |> String.split("")
  end
```
\\\\\\\\\\\
