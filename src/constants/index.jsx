import {
    Home,
    Users,
    FileText,
    Trophy,
    CheckCircle,
    ImagePlus,
    Wallet2,
    UserPlus2,
  Medal,
IndianRupee,
Timer,
  ListOrdered, Banknote
  } from "lucide-react";
  
  export const navbarLinks = {
    Admin: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/dashboard",
      },
      {
        label: "Manage Users",
        icon: Users,
        path: "/manageuser",
      },

{
  label: "Manage Transaction",
  icon: Wallet2,
  children: [
    {
      label: "All Transactions",
      icon: FileText,       // 📄 for listing all transaction records
      path: "/Alltransaction",
    },
     {
      label: "Add Money",
      icon: IndianRupee,       // 📄 for listing all transaction records
      path: "/addmoneyuser",
    },
    {
      label: "Manual Deposits",
      icon: Banknote,       // 💵 clearly indicates money-related actions
      path: "manualdeposits",
    },
     {
      label: "Manual Withdrawals",
      icon: Banknote,       // 💵 clearly indicates money-related actions
      path: "manualwithdrawals",
    },
  ],
},
      {
        label: "Manage Referrals",
        icon: UserPlus2,
        path: "/manage-referrals",
      },
      
     {
    label: "Manage Results",
    icon: Trophy,
    children: [
      {
        label: "Declare Result",
        icon: Medal, 
        path: "/manageresult/declare",
      },
      {
        label: "All Results",
        icon: ListOrdered, 
        path: "/manageresult/all",
      },
    ],
  },
      {
        label: "Manage Bets",
        icon: FileText,
        path: "/managebets",
      },
      {
        label: "Setting",
        icon: CheckCircle,
        path: "/setting",
      },
      {
        label: "Manage Timer",
        icon: Timer,
        path: "/timersetting",
      },
      
      {
        label: "Manage Banners",
        icon: ImagePlus,
        path: "/managebanner",
      },
    ],
  };
  