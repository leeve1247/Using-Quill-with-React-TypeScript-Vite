import { Editor } from "./Editor.tsx";
import style from "./PostForm.module.css";
import { useRef, useState } from "react";
import Quill, { Range } from "quill";
import Delta from "quill-delta";

export function PostForm() {
  const [range, setRange] = useState<Range>();
  const [lastChange, setLastChange] = useState<Delta>();
  const [readOnly, setReadOnly] = useState(false);

  // Use a ref to access the quill instance directly
  const quillRef = useRef<Quill>(null);

  return (
    <div>
      <Editor
        ref={quillRef}
        readOnly={readOnly}
        defaultValue={new Delta()
          .insert("Hello")
          .insert("\n", { header: 1 })
          .insert("Some ")
          .insert("initial", { bold: true })
          .insert(" ")
          .insert("content", { underline: true })}
        onSelectionChange={setRange}
        onTextChange={setLastChange}
      />
      <div className={style.controls}>
        <label>
          Read Only:{" "}
          <input
            type="checkbox"
            value={readOnly.toString()}
            onChange={(e) => setReadOnly(e.target.checked)}
          />
        </label>
        <button
          className="controls-right"
          type="button"
          onClick={() => {
            alert(quillRef.current?.getLength());
          }}
        >
          Get Content Length
        </button>
      </div>
      <div className={style.state}>
        <div className={style["state-title"]}>Current Range:</div>
        {range ? JSON.stringify(range) : "Empty"}
      </div>
      <div className={style.state}>
        <div className={style["state-title"]}>Last Change:</div>
        {lastChange ? JSON.stringify(lastChange.ops) : "Empty"}
      </div>
    </div>
  );
}
