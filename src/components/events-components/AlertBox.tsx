import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

interface Props {
  type: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
}

const AlertBox = (props: Props) => {
  const { type, children } = props;
  const config = {
    success: {
      icon: CheckCircleIcon,
      bgColor: "green-100",
      textColor: "green-700",
      titleColor: "green-800",
      iconColor: "oklch(44.8% .119 151.328)",
    },
    warning: {
      icon: CheckCircleIcon,
      bgColor: "yellow-100",
      textColor: "yellow-700",
      titleColor: "yellow-800",
      iconColor: "oklch(47.6% .114 61.907)",
    },
    error: {
      icon: XCircleIcon,
      bgColor: "red-100",
      textColor: "red-700",
      titleColor: "red-800",
      iconColor: "oklch(44.4% .177 26.899)",
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: "blue-100",
      textColor: "blue-700",
      titleColor: "blue-700",
      iconColor: "oklch(48.8% .243 264.376)",
    },
  };

  const { icon: Icon, bgColor, textColor, iconColor } = config[type];

  return (
    <div
      className={`flex items-center gap-2 p-4 0 bg-${bgColor} rounded-lg w-full`}
    >
      <Icon className={`h-6 w-6 flex-shrink-0`} color={iconColor} />
      <div className={`text-${textColor}`}>{children}</div>
    </div>
  );
};

export default AlertBox;
