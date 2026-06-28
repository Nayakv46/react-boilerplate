import {
  flexRender,
  type Table as TanstackTable,
  type Row,
} from "@tanstack/react-table";
import React from "react";

import { getFunctionRowColor } from "@/pages/Portfolio/utils";
import { ScoreGauge } from "@/components/ScoreGauge/ScoreGauge";

interface Props<T> {
  table: TanstackTable<T>;
  className?: string;
  // Optional external function to provide additional classname for each row.
  // Receives the row and the visible row index.
  rowClassName?: (row: Row<T>, index: number) => string | undefined;
}
export function Table<T>({ table, className, rowClassName }: Props<T>) {
  const rows = table.getRowModel().rows;

  const groupKey = table.getState().grouping?.[0] as string | undefined;

  // In grouped mode, top-level rows are group containers.
  // Use leaf rows for the custom table rendering.
  const visibleRows = groupKey
    ? rows.flatMap((row) => row.getLeafRows())
    : rows.filter((row) => !row.getIsGrouped());

  // Calculate total width ratio
  const totalRatio = table
    .getAllLeafColumns()
    .reduce(
      (sum, col) => sum + ((col.columnDef.meta as any)?.widthRatio ?? 1),
      0,
    );

  // Get width percentage for a column
  const getColumnWidth = (widthRatio: number) => {
    return ((widthRatio / totalRatio) * 100).toFixed(2) + "%";
  };

  // Find the gauge column
  const gaugeColumn = table
    .getAllLeafColumns()
    .find((col) => (col.columnDef.meta as any)?.isGroupScoreColumn);

  // Calculate average functional score for a group
  const getGroupScore = (groupValue: any) => {
    if (!groupKey || !gaugeColumn) return 0;
    const groupRows = visibleRows.filter(
      (row) => row.getValue(groupKey as any) === groupValue,
    );
    const scoreKey = (gaugeColumn.columnDef as any).accessorKey as string;
    const scores = groupRows
      .map((row) => {
        const score = (row.original as any)?.[scoreKey];
        return typeof score === "number"
          ? score
          : Number(score)
            ? Number(score)
            : 0;
      })
      .filter((score) => score > 0);

    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };
  // Calculate group information for gauge rendering
  const groupInfo = new Map();
  visibleRows.forEach((row, index) => {
    const currentGroup = groupKey ? row.getValue(groupKey) : null;
    if (!groupInfo.has(currentGroup) && currentGroup) {
      const count = visibleRows.filter(
        (r) => r?.getValue(groupKey as any) === currentGroup,
      ).length;
      groupInfo.set(currentGroup, {
        score: getGroupScore(currentGroup),
        rowCount: count,
        startIndex: index,
      });
    }
  });

  return (
    <div className={`w-full flex gap-4 ${className || ""}`}>
      <div className="flex-1 overflow-x-auto rounded-lg">
        <table
          className="w-full min-w-[300px]"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const meta = h.column.columnDef.meta as any;
                  const widthRatio = meta?.widthRatio ?? 1;
                  const isGaugeColumn = meta?.isGroupScoreColumn === true;

                  // Skip gauge column header
                  if (isGaugeColumn) {
                    return null;
                  }

                  return (
                    <th
                      key={h.id}
                      style={{ width: getColumnWidth(widthRatio) }}
                      className={`px-4 py-3 text-left text-sm font-medium truncate ${
                        meta?.headerClassName || ""
                      }`}
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {visibleRows.map((row, index) => {
              const prev = visibleRows?.[index - 1];
              const next = visibleRows?.[index + 1];

              const currentGroup = groupKey ? row.getValue(groupKey) : null;
              const prevGroup =
                groupKey && prev ? prev?.getValue(groupKey as any) : null;
              const nextGroup =
                groupKey && next ? next?.getValue(groupKey as any) : null;

              const isStartOfGroup =
                !groupKey || index === 0 || currentGroup !== prevGroup;

              const isEndOfGroup =
                !groupKey ||
                index === visibleRows.length - 1 ||
                currentGroup !== nextGroup;

              const func = (row.original as any)?.function;

              // Count rows in current group
              // let groupRowCount = 1;
              // if (groupKey && isStartOfGroup) {
              //   groupRowCount = visibleRows.filter(
              //     (r) => r.getValue(groupKey as any) === currentGroup,
              //   ).length;
              // }

              return (
                <React.Fragment key={row.id}>
                  {/* GAP between groups */}
                  {groupKey && isStartOfGroup && index !== 0 && (
                    <tr>
                      <td colSpan={table.getAllLeafColumns().length}>
                        <div className="h-2" />
                      </td>
                    </tr>
                  )}

                  <tr
                    className={`transition hover:opacity-80 ${func ? getFunctionRowColor(func) : ""} ${
                      rowClassName
                        ? (rowClassName(row as Row<T>, index) ?? "")
                        : ""
                    }`}
                  >
                    {(() => {
                      const visibleCells = row
                        .getVisibleCells()
                        .filter((cell) => {
                          const meta = cell.column.columnDef.meta as any;
                          return meta?.isGroupScoreColumn !== true;
                        });

                      const nonHiddenCellIndexes = visibleCells
                        .map((cell, idx) => {
                          const meta = cell.column.columnDef.meta as any;
                          const classNames = `${meta?.headerClassName || ""} ${meta?.cellClassName || ""}`;
                          const isHiddenByClass = /(^|\s)w-0(\s|$)/.test(
                            classNames,
                          );
                          const isHiddenByRatio = meta?.widthRatio === 0;
                          return isHiddenByClass || isHiddenByRatio ? -1 : idx;
                        })
                        .filter((idx) => idx !== -1);

                      const firstVisibleIndex = nonHiddenCellIndexes[0] ?? 0;
                      const lastVisibleIndex =
                        nonHiddenCellIndexes[nonHiddenCellIndexes.length - 1] ??
                        visibleCells.length - 1;

                      return visibleCells.map((cell, visibleIndex) => {
                        const isFirst = visibleIndex === firstVisibleIndex;
                        const isLast = visibleIndex === lastVisibleIndex;
                        const meta = cell.column.columnDef.meta as any;
                        const widthRatio = meta?.widthRatio ?? 1;

                        const base = "px-4 py-2 text-sm";

                        const rounding = [
                          isStartOfGroup && isFirst ? "rounded-tl-lg" : "",
                          isStartOfGroup && isLast ? "rounded-tr-lg" : "",
                          isEndOfGroup && isFirst ? "rounded-bl-lg" : "",
                          isEndOfGroup && isLast ? "rounded-br-lg" : "",
                        ]
                          .filter(Boolean)
                          .join(" ");

                        return (
                          <td
                            key={cell.id}
                            style={{ width: getColumnWidth(widthRatio) }}
                            className={`${base} ${rounding} ${meta.outerCellClassName || ""}`}
                          >
                            <div
                              className={`truncate ${meta.cellClassName || ""}`}
                            >
                              {/* {cell.id} */}
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </div>
                          </td>
                        );
                      });
                    })()}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Gauges Container */}
      {groupKey && gaugeColumn && (
        <div className="flex flex-col  min-w-max mt-11">
          {visibleRows.map((row, index) => {
            const currentGroup = groupKey ? row.getValue(groupKey) : null;
            const prev = visibleRows[index - 1];
            const isStartOfGroup =
              !groupKey ||
              index === 0 ||
              currentGroup !== prev?.getValue(groupKey as any);

            if (!isStartOfGroup) return null;

            const info = groupInfo.get(currentGroup);
            if (!info) return null;

            // Add gap between groups
            if (index !== 0) {
              return (
                <React.Fragment key={`gap-${currentGroup}`}>
                  <div className="h-2.5" />
                  <div
                    key={currentGroup as string}
                    style={{ height: `${info.rowCount * 36}px` }}
                    className={`flex items-center justify-center rounded-lg p-4 ${getFunctionRowColor(currentGroup as string)}`}
                  >
                    <ScoreGauge
                      score={info.score}
                      label={currentGroup as string}
                      size={Math.min(Math.max(info.rowCount * 20, 30), 70)}
                      functionName={currentGroup as string}
                    />
                  </div>
                </React.Fragment>
              );
            }

            return (
              <div
                key={currentGroup as string}
                style={{ height: `${info.rowCount * 36}px` }}
                className={`flex items-center justify-center rounded-lg p-4 ${getFunctionRowColor(currentGroup as string)}`}
              >
                <ScoreGauge
                  score={info.score}
                  label={currentGroup as string}
                  size={Math.min(Math.max(info.rowCount * 20, 30), 70)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
