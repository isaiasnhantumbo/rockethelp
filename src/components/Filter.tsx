import { Button, IButtonProps, Text, useTheme } from "native-base";

interface FilterProps extends IButtonProps {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
}

export function Filter({
  title,
  isActive = false,
  type,
  ...rest
}: FilterProps) {
  const { colors } = useTheme();
  const colorType = type === "open" ? colors.secondary[700] : colors.green[300];
  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colorType}
      bg="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      <Text color={isActive ? colorType : "gray.300"} textTransform="uppercase">{title}</Text>
    </Button>
  );
}
