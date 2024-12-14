import React from "react";
import PropTypes from "prop-types";
import { IconButton, ButtonGroup } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function PaginationGroup({ navigateTo, totalPages }) {
  const [active, setActive] = React.useState(1);

  const getItemProps = (index) => ({
    className: active === index ? "bg-gray-300 text-gray-900" : "",
    onClick: () => {
      setActive(index);
      navigateTo(index);
    },
  });
  return (
    <ButtonGroup variant="outlined" className="flex justify-center">
      <IconButton onClick={() => navigateTo(active - 1)} disabled={active <= totalPages}>
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <IconButton {...getItemProps(page)}>{page}</IconButton>
      ))}
      <IconButton onClick={() => navigateTo(active + 1)} disabled={active >= totalPages}>
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </ButtonGroup >

  );
}

PaginationGroup.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};
