import type { JSX } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Resource } from "@/lib/types";

export function SearchPalette(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  results: Resource[];
  onQuery: (query: string) => void;
  /** Where focus returns on close. The palette has no trigger element, it opens from a shortcut. */
  returnFocusTo?: HTMLElement | null;
}): JSX.Element {
  const { open, onOpenChange, query, results, onQuery, returnFocusTo } = props;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      onCloseAutoFocus={(event) => {
        if (!returnFocusTo?.isConnected) return;
        event.preventDefault();
        returnFocusTo.focus();
      }}
      title="Search the library"
      description="Search titles, topics and short descriptions."
    >
      <Command shouldFilter={false}>
        <CommandInput value={query} onValueChange={onQuery} placeholder="Search the library" />
        <CommandList>
          <CommandEmpty>Nothing matches that search.</CommandEmpty>
          <CommandGroup heading="Resources">
            {results.map((resource) => (
              <CommandItem
                key={resource.id}
                value={resource.id}
                onSelect={() => {
                  window.open(resource.url, "_blank", "noopener,noreferrer");
                  onOpenChange(false);
                }}
              >
                {resource.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
