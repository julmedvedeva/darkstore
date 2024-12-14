import {
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Goods, OrdersPage, EditPage, CreatePage } from "@/pages/dashboard";


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
        element: <OrdersPage />,
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
      {
        isShow: false,
        icon: <InformationCircleIcon {...icon} />,
        name: "create",
        path: "/orders/create",
        element: <CreatePage />,
      },
    ],
  },

];

export default routes;
