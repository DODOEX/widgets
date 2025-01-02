import { Box } from "@dodoex/components";
import React from "react";

export function CreateItem({
  title,
  disabled,
  children,
}: React.PropsWithChildren<{
  title: React.ReactNode;
  disabled?: boolean;
}>) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      opacity: disabled ? 0.3 : undefined,
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 600,
      }}>{title}</Box>
      {children}
    </Box>
  )
}