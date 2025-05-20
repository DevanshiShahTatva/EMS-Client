import React from "react";

interface Props {
  handleButtonClick: () => void;
  isDisabled?: boolean;
  isSubmitting?: boolean;
  type?: "button" | "submit" | "reset";
}
const CommonAIButton = (props: Props) => {
  const {
    isDisabled,
    isSubmitting,
    handleButtonClick,
    type = "button",
  } = props;
  return (
    <button
      type={type}
      onClick={() => handleButtonClick()}
      disabled={isDisabled || isSubmitting}
      className="mt-1 flex items-center px-2 py-1 cursor-pointer text-white rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg hover:shadow-xl transition-shadow duration-300 disabled:from-purple-400 disabled:to-indigo-400"
    >
      <span className="mr-2">✨</span>
      {isSubmitting ? "Generating.." : "Generate With AI"}
      <span className="ml-2">✨</span>
    </button>
  );
};

export default CommonAIButton;
