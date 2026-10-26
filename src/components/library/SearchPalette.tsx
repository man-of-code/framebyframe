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
}): JSX.Element {
  const { open, onOpenChange, query, results, onQuery } = props;

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search the library"
      description="Search titles, topics, and the one-line why."
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
