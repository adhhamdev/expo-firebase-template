import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";

import { useAppTheme } from "@/hooks/use-app-theme";

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

export type IconName = MaterialIconName;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

/** App-wide Material Icons wrapper. Theme-aware default color. */
export function Icon({ name, size = 24, color }: IconProps) {
  const { colors } = useAppTheme();
  const resolved = color ?? colors.onSurface;
  return <MaterialIcons name={name} size={size} color={resolved} />;
}
