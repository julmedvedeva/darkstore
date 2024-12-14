import {
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Orders, Goods } from "@/pages/dashboard";
import { EditPage } from "@/pages/dashboard/edit";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    isShow: true,
    pages: [
      {
        isShow: true,
        icon: <UserIcon {...icon} />,
        name: "orders",
        path: "/orders",
        element: <Orders />,
      },

      {
        isShow: true,
        icon: <InformationCircleIcon {...icon} />,
        name: "goods",
        path: "/goods",
        element: <Goods />,
      },
      {
        isShow: false,
        icon: <InformationCircleIcon {...icon} />,
        name: "edit",
        path: "/orders/:id/edit",
        element: <EditPage />,
      },
    ],
  },

];

export default routes;
