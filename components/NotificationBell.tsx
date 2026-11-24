"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notificationMessage, useNotification } from "@/lib/hooks/use-notification";

const relativeTime = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

function timeAgo(iso: string) {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  if (Math.abs(seconds) < 60) return relativeTime.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(hours / 24), "day");
}

export default function NotificationBell() {
  const { notifications, dismiss, clear } = useNotification();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !seen.has(n.id)).length;

  function toggle() {
    if (!open) setSeen(new Set(notifications.map((n) => n.id)));
    setOpen(!open);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={unread > 0 ? `Notifications, ${unread} non lue${unread > 1 ? "s" : ""}` : "Notifications"}
        className="relative flex size-10 cursor-pointer items-center justify-center rounded-full bg-primary/20 text-primary transition duration-75 hover:bg-primary/35"
      >
        <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg bg-primary text-primary-foreground shadow-lg">
          <div className="flex items-center justify-between border-b border-primary-foreground/15 px-4 py-3">
            <p className="font-semibold">Notifications</p>
            {notifications.length > 0 && (
              <button type="button" onClick={clear} className="cursor-pointer text-xs font-semibold hover:underline">
                Tout effacer
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm italic opacity-70">Aucune notification pour l&apos;instant.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id} className="flex items-start gap-2 border-b border-primary-foreground/10 last:border-b-0">
                  <Link
                    href={`/drops/${n.dropId}`}
                    onClick={() => setOpen(false)}
                    className="flex-1 px-4 py-3 text-sm hover:bg-primary-foreground/5"
                  >
                    <span className="block">{notificationMessage(n)}</span>
                    <time dateTime={n.at} className="text-xs opacity-60">
                      {timeAgo(n.at)}
                    </time>
                  </Link>
                  <button
                    type="button"
                    onClick={() => dismiss(n.id)}
                    aria-label="Retirer la notification"
                    className="mt-2 mr-2 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-lg leading-none opacity-60 hover:bg-primary-foreground/10 hover:opacity-100"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
