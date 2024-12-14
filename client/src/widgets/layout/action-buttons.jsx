import React from "react";
import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
export const ActionButtons = ({ onCreate }) => {
  return (
    <div className="flex">
      <Button
        onClick={onCreate}
        className="bg-blue-500 text-white hover:bg-blue-600"
      >
        Create order
      </Button>
    </div>
  );
};
ActionButtons.propTypes = {
  onCreate: PropTypes.func.isRequired,
};
export default ActionButtons;
