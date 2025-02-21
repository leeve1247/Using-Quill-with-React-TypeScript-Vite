import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef
} from "react";
import Quill, { Range } from "quill";
import Delta from "quill-delta";
import "quill/dist/quill.snow.css";

interface EditorProps {
  readOnly: boolean;
  defaultValue: Delta;
  onTextChange: (delta: Delta) => void;
  onSelectionChange: (range: Range) => void;
  ref: RefObject<Quill|null>
}

export function Editor({readOnly, defaultValue, onTextChange, onSelectionChange, ref}:EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  });

  useEffect(() => {
    ref.current?.enable(!readOnly);
  }, [ref, readOnly]);

  useEffect(() => {
    const container = containerRef.current;
    const editorContainer = container?.appendChild(
      container.ownerDocument.createElement("div"),
    );
    if (!editorContainer) return;
    const quill = new Quill(editorContainer, {
      theme: "snow",
    });

    ref.current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    quill.on(Quill.events.TEXT_CHANGE, (delta: Delta) => {
      onTextChangeRef.current?.(delta);
    });

    quill.on(Quill.events.SELECTION_CHANGE, (range: Range) => {
      onSelectionChangeRef.current?.(range);
    });

    return () => {
      ref.current = null;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [ref]);

  return <div ref={containerRef}></div>;
}
