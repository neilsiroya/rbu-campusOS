"use client";

import { useEffect, useRef } from "react";
import "./cursor-spotlight.css";

/** Ambient pointer light; the native cursor and all hit targets remain untouched. */
export default function CursorSpotlight() {
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const light = lightRef.current;
    if (!light) return;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let x = 0, y = 0, targetX = 0, targetY = 0, previousTime = 0;
    let active = false;

    const hide = () => {
      active = false;
      light.dataset.visible = "false";
      light.dataset.pressed = "false";
      cancelAnimationFrame(frame);
      frame = 0;
      clearTimeout(idle);
    };
    const tick = (time: number) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16;
      previousTime = time;
      const ease = 1 - Math.exp(-elapsed / 65);
      x += (targetX - x) * ease;
      y += (targetY - y) * ease;
      light.style.transform = `translate3d(${x - 180}px, ${y - 180}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .15) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        previousTime = 0;
      }
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType !== "mouse" || document.hidden) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) { x = targetX; y = targetY; previousTime = 0; }
      active = true;
      light.dataset.visible = "true";
      const target = event.target instanceof Element ? event.target : null;
      light.dataset.interactive = String(Boolean(target?.closest("a[href],button:not(:disabled),[role='button'],input,textarea,select")));
      if (!frame) frame = requestAnimationFrame(tick);
      clearTimeout(idle);
      idle = setTimeout(hide, 1400);
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };
    const press = () => { light.dataset.pressed = "true"; };
    const release = () => { light.dataset.pressed = "false"; };
    const visibility = () => { if (document.hidden) hide(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab") hide(); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", hide, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("keydown", keyboard);
    document.addEventListener("visibilitychange", visibility);
    finePointer.addEventListener("change", hide);
    reducedMotion.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      window.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", visibility);
      finePointer.removeEventListener("change", hide);
      reducedMotion.removeEventListener("change", hide);
    };
  }, []);

  return <div ref={lightRef} className="cursor-spotlight" aria-hidden="true" data-visible="false"><div className="cursor-spotlight-lens" /></div>;
}
