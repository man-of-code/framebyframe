import type { JSX } from "react";
import { facetValueLabel } from "@/components/library/labels";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Resource } from "@/lib/types";

export function ResultsTable(props: { resources: Resource[] }): JSX.Element {
  return (
    <Table className="library-table">
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Why</TableHead>
          <TableHead>Verified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.resources.map((resource) => (
          <TableRow key={resource.id}>
            <TableCell>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.title}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </TableCell>
            <TableCell>{facetValueLabel("type", resource.type)}</TableCell>
            <TableCell>{facetValueLabel("cost", resource.cost)}</TableCell>
            <TableCell>{facetValueLabel("level", resource.level)}</TableCell>
            <TableCell>{resource.why}</TableCell>
            <TableCell>{resource.verified}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
