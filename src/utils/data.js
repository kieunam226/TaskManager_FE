import { LuLayoutDashboard,  LuUsers, LuClipboardCheck , LuSquarePlus, LuLogOut } from "react-icons/lu";

export const SIDE_MENU_DATA = [
        {
            id: "01",
            label: "Dashboard",
            icon: LuLayoutDashboard,
            path:"/admin/dashboard", 
        },
        {
            id: "02",
            label: "Manager Task",
            icon: LuClipboardCheck,
            path:"/admin/tasks", 
        },
        {
            id: "03",
            label: "Create Task",
            icon: LuSquarePlus,
            path:"/admin/create-task", 
        },
        {
            id: "04",
            label: "Team members",
            icon: LuUsers,
            path:"/admin/users", 
        },
        {
            id: "05",
            label: "Logout",
            icon: LuLogOut,
            path:"logout", 
        },
];

export const SIDE_MENU_USERS_DATA = [
    {
            id: "01",
            label: "Dashboard",
            icon: LuLayoutDashboard,
            path:"/user/dashboard", 
        },
        {
            id: "02",
            label: "My Tasks",
            icon: LuClipboardCheck,
            path:"/user/tasks", 
        },
        {
            id: "05",
            label: "Logout",
            icon: LuLogOut,
            path:"logout", 
        },
];

export const PRIORITY_DATA = [
   { label:"low" , value : "low"  },
   { label:"medium" , value : "medium"  },
   { label:"high" , value : "high"  },
];

export const STATUS_DATA = [
   { label:"pending" , value : "pending" },
   { label:"in-progress" , value : "in-progress" },
   { label:"completed" , value : "completed" },
];