"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function Frame({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface-2/50 p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</p>
      <div className="flex min-h-[140px] flex-col items-center justify-center gap-4">{children}</div>
      {hint ? <p className="mt-4 text-center text-xs text-text-muted">{hint}</p> : null}
    </div>
  );
}

function LoopVisual() {
  const items = [0, 1, 2, 3, 4];
  const [i, setI] = useState(0);
  return (
    <Frame title="Interactive step-through: for i in range(5)" hint="Click Next to step through each loop iteration.">
      <div className="flex gap-2">
        {items.map((v) => (
          <div
            key={v}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-semibold transition",
              v === i ? "border-accent-blue bg-accent-blue text-white scale-110" : "border-border bg-surface text-text-muted",
            )}
          >
            {v}
          </div>
        ))}
      </div>
      <p className="text-sm text-text">
        Iteration <span className="font-semibold text-accent-blue">i = {i}</span> — loop body executes once per value.
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setI((v) => Math.max(0, v - 1))}>
          <ChevronLeft size={14} /> Prev
        </Button>
        <Button size="sm" onClick={() => setI((v) => Math.min(items.length - 1, v + 1))}>
          Next <ChevronRight size={14} />
        </Button>
      </div>
    </Frame>
  );
}

function ArrayVisual() {
  const values = [12, 45, 7, 23, 9];
  const [selected, setSelected] = useState(0);
  return (
    <Frame title="Array indexing — O(1) random access" hint="Click any box to see how arr[index] resolves instantly.">
      <div className="flex gap-2">
        {values.map((v, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={cn(
              "flex h-14 w-14 flex-col items-center justify-center rounded-lg border text-sm font-semibold transition",
              idx === selected ? "border-accent-blue bg-accent-blue text-white" : "border-border bg-surface text-text hover:bg-surface-2",
            )}
          >
            {v}
            <span className={cn("text-[10px] font-normal", idx === selected ? "text-white/80" : "text-text-muted")}>
              [{idx}]
            </span>
          </button>
        ))}
      </div>
      <p className="text-sm text-text">
        <span className="font-mono text-accent-blue">arr[{selected}]</span> = <span className="font-semibold">{values[selected]}</span>
      </p>
    </Frame>
  );
}

function ClassVisual() {
  const [count, setCount] = useState(1);
  return (
    <Frame title="Class → Object instantiation" hint="Each 'new Student(...)' creates an independent object from the same class.">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="rounded-xl border-2 border-dashed border-accent-blue px-4 py-3 text-center">
          <p className="text-xs font-semibold text-accent-blue">class Student</p>
          <p className="mt-1 text-[11px] text-text-muted">name, semester</p>
          <p className="text-[11px] text-text-muted">display()</p>
        </div>
        <div className="flex flex-col gap-2 text-accent-blue">
          {Array.from({ length: count }).map((_, idx) => (
            <span key={idx}>→</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-surface px-3 py-2 text-center">
              <p className="text-xs font-semibold text-text">Object #{idx + 1}</p>
              <p className="text-[11px] text-text-muted">name = "Student {idx + 1}"</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setCount((c) => Math.max(1, c - 1))}>
          <Minus size={14} /> Remove object
        </Button>
        <Button size="sm" onClick={() => setCount((c) => Math.min(4, c + 1))}>
          <Plus size={14} /> new Student()
        </Button>
      </div>
    </Frame>
  );
}

function InheritanceVisual() {
  return (
    <Frame title="Inheritance hierarchy" hint="Child classes inherit fields/methods from the parent and can override them.">
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-xl border border-accent-blue bg-accent-blue-soft px-4 py-2 text-sm font-semibold text-accent-blue">
          Parent Class
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-px bg-border" />
            <div className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text">
              Child Class A
            </div>
            <p className="text-[10px] text-text-muted">overrides a method</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-px bg-border" />
            <div className="rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text">
              Child Class B
            </div>
            <p className="text-[10px] text-text-muted">adds new behaviour</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function StackVisual() {
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [nextVal, setNextVal] = useState(40);
  return (
    <Frame title="Stack — LIFO (Last In, First Out)" hint="Push adds to the top; Pop removes from the top.">
      <div className="flex min-h-[120px] flex-col-reverse items-center gap-1.5">
        {stack.map((v, idx) => (
          <div
            key={idx}
            className={cn(
              "flex h-10 w-24 items-center justify-center rounded-lg border text-sm font-semibold",
              idx === stack.length - 1 ? "border-accent-blue bg-accent-blue text-white" : "border-border bg-surface text-text",
            )}
          >
            {v}
          </div>
        ))}
        {stack.length === 0 && <p className="text-xs text-text-muted">Stack is empty</p>}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            setStack((s) => [...s, nextVal]);
            setNextVal((n) => n + 10);
          }}
        >
          <Plus size={14} /> push({nextVal})
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStack((s) => s.slice(0, -1))} disabled={stack.length === 0}>
          <Minus size={14} /> pop()
        </Button>
      </div>
    </Frame>
  );
}

function QueueVisual() {
  const [queue, setQueue] = useState<number[]>([1, 2, 3]);
  const [nextVal, setNextVal] = useState(4);
  return (
    <Frame title="Queue — FIFO (First In, First Out)" hint="Enqueue adds to the rear; Dequeue removes from the front.">
      <div className="flex min-h-[60px] items-center gap-1.5">
        {queue.map((v, idx) => (
          <div
            key={idx}
            className={cn(
              "flex h-10 w-14 items-center justify-center rounded-lg border text-sm font-semibold",
              idx === 0 ? "border-accent-blue bg-accent-blue text-white" : "border-border bg-surface text-text",
            )}
          >
            {v}
          </div>
        ))}
        {queue.length === 0 && <p className="text-xs text-text-muted">Queue is empty</p>}
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            setQueue((q) => [...q, nextVal]);
            setNextVal((n) => n + 1);
          }}
        >
          <Plus size={14} /> enqueue({nextVal})
        </Button>
        <Button size="sm" variant="outline" onClick={() => setQueue((q) => q.slice(1))} disabled={queue.length === 0}>
          <Minus size={14} /> dequeue()
        </Button>
      </div>
    </Frame>
  );
}

function LinkedListVisual() {
  const [nodes, setNodes] = useState<number[]>([5, 10, 15]);
  const [nextVal, setNextVal] = useState(20);
  return (
    <Frame title="Linked List — node + pointer chain" hint="Each node points to the next; the last node points to null.">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {nodes.map((v, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <div className="rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-text">{v}</div>
            <span className="text-text-muted">→</span>
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-text-muted">null</div>
      </div>
      <Button
        size="sm"
        onClick={() => {
          setNodes((n) => [...n, nextVal]);
          setNextVal((v) => v + 5);
        }}
      >
        <Plus size={14} /> insert at tail
      </Button>
    </Frame>
  );
}

function FunctionVisual() {
  const [called, setCalled] = useState(false);
  return (
    <Frame title="Function call — input → logic → output" hint="Click Call to see data flow through the function.">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg border px-3 py-2 text-sm font-medium", called ? "border-accent-blue bg-accent-blue-soft text-accent-blue" : "border-border bg-surface text-text")}>
          input: 82
        </div>
        <span className="text-text-muted">→</span>
        <div className={cn("rounded-lg border px-3 py-2 text-sm font-medium", called ? "border-accent-blue bg-accent-blue text-white" : "border-border bg-surface text-text")}>
          calculateGrade()
        </div>
        <span className="text-text-muted">→</span>
        <div className={cn("rounded-lg border px-3 py-2 text-sm font-medium", called ? "border-success bg-success-soft text-success" : "border-border bg-surface text-text")}>
          {called ? '"Distinction"' : "output: ?"}
        </div>
      </div>
      <Button size="sm" onClick={() => setCalled((c) => !c)}>
        <RotateCcw size={14} /> {called ? "Reset" : "Call function"}
      </Button>
    </Frame>
  );
}

function VariableVisual() {
  const [value, setValue] = useState(20);
  return (
    <Frame title="Variable as a labelled box" hint="Reassigning a variable just changes what's inside the box.">
      <div className="rounded-xl border-2 border-accent-blue bg-accent-blue-soft px-6 py-4 text-center">
        <p className="text-xs font-semibold text-accent-blue">age</p>
        <p className="mt-1 text-2xl font-bold text-text">{value}</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => setValue((v) => v - 1)}>
          <Minus size={14} />
        </Button>
        <Button size="sm" onClick={() => setValue((v) => v + 1)}>
          <Plus size={14} />
        </Button>
      </div>
    </Frame>
  );
}

export function ConceptVisualizer({ visualType }: { visualType: string }) {
  switch (visualType) {
    case "loop":
      return <LoopVisual />;
    case "array":
      return <ArrayVisual />;
    case "class":
      return <ClassVisual />;
    case "inheritance":
      return <InheritanceVisual />;
    case "stack":
      return <StackVisual />;
    case "queue":
      return <QueueVisual />;
    case "linkedlist":
      return <LinkedListVisual />;
    case "function":
      return <FunctionVisual />;
    case "variable":
      return <VariableVisual />;
    default:
      return null;
  }
}
