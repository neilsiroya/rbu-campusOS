import * as React from "react";
import { cn } from "cn";

function Switch({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn(
        "peer h-5 w-9 rounded-full bg-primary/10 border-2 border-primary/20 appearance-none cursor-pointer transition-colors checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Switch };