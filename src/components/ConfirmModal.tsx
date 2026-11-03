"use client";

import Modal from "./Modal";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Keep it",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal open={open} title={title} onClose={busy ? () => {} : onCancel}>
      <p className="mb-6 leading-relaxed text-base-content/70">{message}</p>
      <div className="flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          {cancelText}
        </button>
        <button className={`btn ${danger ? "btn-error" : "btn-primary"}`} onClick={onConfirm} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
