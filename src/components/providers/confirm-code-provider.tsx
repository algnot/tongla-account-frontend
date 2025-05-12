"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Input } from "../ui/input";

export function ConfirmCodeDialogComponent({
  title,
  text,
  action,
  onCancel,
}: {
  title: string;
  text: string;
  action: (code: string) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState<string>("");
  const handleActionClick = () => {
    action(code);
  };

  return (
    <AlertDialog open={title !== "" || text !== ""}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <span dangerouslySetInnerHTML={{ __html: text }} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="text"
          id="code"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="your 2FA code"
        />
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={onCancel}>
            cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer"
            onClick={handleActionClick}
          >
            confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const ConfirmCodeContext = createContext(
  (title: string, text: string, action: void | ((code: string) => void)) => {
    return [title, text, action];
  }
);

export function ConfirmCodeProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [action, setAction] = useState<void | ((code: string) => void)>();

  const onChangeConfirmCode = useCallback(
    (title: string, text: string, action: void | ((code: string) => void)) => {
      setTitle(title);
      setText(text);
      setAction(() => action);
      return [title, text, action];
    },
    []
  );

  const onCancel = () => {
    setTitle("");
    setText("");
    setAction(() => {});
  };

  return (
    <ConfirmCodeContext.Provider value={onChangeConfirmCode}>
      {(title != "" || text != "") && (
        <ConfirmCodeDialogComponent
          title={title}
          text={text}
          action={action ?? (() => {})}
          onCancel={onCancel}
        />
      )}
      {children}
    </ConfirmCodeContext.Provider>
  );
}

export const useConfirmCodeContext = () => useContext(ConfirmCodeContext);
