---
type: title
---

#### Process Oriented Programming in Elixir
\\\\\\\\\\\

## Agenda

* Introducing Elixir
* Processes and OTP
* What even is OOP?
* POD (Process Oriented Design)
* An Elixir AdVenture
\\\\\\\\\\\
---
type: poll
options:
  - Heard of it
  - Read about it
  - Written some code
  - Shipped projects
---
Have you Elixired?
\\\\\\\\\\\
---

---
## Elixir
* Created by Jose Valim in 2012
* Functional
* Immutable
* Approachable syntax
* Runs on Erlang VM (BEAM)
\\\\\\\\\\\
---

---
## Erlang
* Ericcson circa 1987
* Designed to run Telco systems
* Very high concurrency
* Very high availability
* Prolog inspired syntax
\\\\\\\\\\\
---

---
## Basic Types
```
1                  # integer
0x1F               # integer
1.0                # float
true               # boolean
:atom              # atom / symbol
"elixir"           # string
[1, 2, 3]          # list
{1, 2, 3}          # tuple
%{a: "b", c: "d"}  # map
```
\\\\\\\\\\\
---

---
## Hello Elixir
```elixir
defmodule ElixirExample do

  def simple_function(number) do
    number + number
  end

end
```
\\\\\\\\\\\
---
type: fork
paths:
  - pipeline
  - pattern_matching
---
## What shall we learn first?
\\\\\\\\\\\
---

---
## Processes
* Incredibly light (1k)
* No shared anything
* Communicate via message passing
\\\\\\\\\\\
## Process primitives
* spawn
* send
* receive
\\\\\\\\\\\
## Mailboxes etc
![20x15](images/process_mailboxes.png)
\\\\\\\\\\\
---

---
## Pong demo
\\\\\\\\\\\
---

---
## OTP
* Open Telecom Platform
* Developed over 20 years of Telco systems in Erlang
* Patterns, libraries and tools
* Zero downtime, high traffic distributed systems
* Extremely large
* Not the greatest docs
\\\\\\\\\\\
## OTP in Elixir
* Implemented as behaviours
* Kind of like inheritance
* The most useful bits
* Well documented
\\\\\\\\\\\
## GenServer
Allows a module to implement a stateful server process
\\\\\\\\\\\
---

---
## State? You mean the mutable kind?
\\\\\\\\\\\
---

---
## Yes. But it will be ok. I promise
\\\\\\\\\\\
---

---
```
defmodule Stack do
  use GenServer

  # Callbacks

  def handle_call(:pop, _from, [h | t]) do
    {:reply, h, t}
  end

  def handle_cast({:push, item}, state) do
    {:noreply, [item | state]}
  end
end
```
\\\\\\\\\\\
---

---
```
# Start the server
{:ok, pid} = GenServer.start_link(Stack, [:hello])

# This is the client
GenServer.call(pid, :pop)
#=> :hello

GenServer.cast(pid, {:push, :world})
#=> :ok

GenServer.call(pid, :pop)
#=> :world
```
\\\\\\\\\\\
---

---
## Let it crash
\\\\\\\\\\\
---

---
## Supervisors
* Clean up the mess
* Multiple strategies
* Can form supervision trees
\\\\\\\\\\\
---

---
## This is a meta presentation
\\\\\\\\\\\

## A brief history of OOP
* Alan Kay
* Smalltalk
* 1970s
\\\\\\\\\\\
---

---
"I thought of objects being like biological cells and/or individual
computers on a network, only able to communicate with messages (so
messaging came at the very beginning -- it took a while to see how to
do messaging in a programming language efficiently enough to be
useful)"



"OOP to me means only messaging, local retention and protection and
hiding of state-process, and extreme late-binding of all things."

### --Alan Kay
\\\\\\\\\\\

## Key features of OOP
* Message passing
* State encapsulation
* Late binding

\\\\\\\\\\\

## What isn't in here?
* Classes
* Interfaces
* Inheritance
\\\\\\\\\\\
---

---
### How OO is OO?
Let's pick on a typical OO web MVC framework
\\\\\\\\\\\
---
align: left
---
## A presentation app
#### As the presenter, I want to advance my slides so I can do my presentation
#### As an attendee, I want to see the current slide so I can keep up
\\\\\\\\\\\
---

---
```
class SlidesController < ApplicationController
  def current_slide
    @slide = Slide.where(current: true)
  end

  def advance_slide
    @current_slide = Slide.where(current: true)
    @next_slide = Slide.find(params[:id])
    @current_slide.update_attributes!(current: false)
    @next_slide.update_attributes!(current: true)
  end
end
```
\\\\\\\\\\\
---

---
## Where's the state?
\\\\\\\\\\\
---

---
## Introducing Venture
* Your watching it now!
* React front end
* Elixir/Phoenix back end
* Slides are markdown (with YAML)
* Supports polls, forks, chat
\\\\\\\\\\\
---

---
## Phoenix
* Default web mvc framework for Elixir
* Easy to grok
* Channels
\\\\\\\\\\\
---

---
## The main processes
* Presentation
* Deck
* Selection
\\\\\\\\\\\
---

---
## Let's see it with `:observer.start`
\\\\\\\\\\\
---

---
## What happens when a user connects?
\\\\\\\\\\\
---

---
## What happens when the presenter advances the slide?
\\\\\\\\\\\
---

---
## How do we design systems like this?
\\\\\\\\\\\
---

---
## Everything is ~~an object~~ a process?
\\\\\\\\\\\
---

---
## No.
\\\\\\\\\\\
---

---
## What makes a good process
* Has a Single Responsibility
* Has state
* There should only be n of them
* Does something async
\\\\\\\\\\\
---

---
## When not to use processes
* to avoid passing context
* to simulate [OO](https://github.com/wojtekmach/oop)
\\\\\\\\\\\
---

---
## What's not a process in Venture?
* Story
* Slide
\\\\\\\\\\\
---

---
## Venturebot
\\\\\\\\\\\
