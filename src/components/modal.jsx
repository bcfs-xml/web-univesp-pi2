import * as Dialog from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";

export function Modal() {
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Trash2 className="text-red-500 cursor-pointer" />
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
      <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-dialog max-w-[450px] max-h-[85vh] w-[90vw] p-6">
        <h1>teste</h1>
      </Dialog.Content>
    </Dialog.Portal>
    <Modal />
  </Dialog.Root>
}