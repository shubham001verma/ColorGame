import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Login from "./routes/Pages/Login";

import ManageUser from "./routes/Pages/ManageUser";
import EditProfile from "./routes/Pages/EditProfile";



import ManageTransactions from "./routes/Pages/ManageTranjections";

import Home from "./routes/Pages/Home";


import { HelmetProvider } from 'react-helmet-async';





import AddBanner from "./routes/Pages/AddBanner";
import EditBanner from "./routes/Pages/EditBanner";
import ManageBanner from "./routes/Pages/ManageBanner";

import WalletPage from "./routes/Pages/WalletPage";
import AdminSettingsPage from "./routes/Pages/AdminSettingsPage";
import SplashScreen from "./routes/Pages/SplashScreen";
import UserLogin from "./routes/Pages/UserLogin";
import UserSignup from "./routes/Pages/UserSignup";
import ManageBets from "./routes/Pages/ManageBets";
import DeclareResult from "./routes/Pages/DeclareResult";
import AllResults from "./routes/Pages/AllResults";
import ManageReferrals from "./routes/Pages/ManageReferrals";
import Account from "./routes/Pages/Account";
import MyHistory from "./routes/Pages/MyHistory";
import UpdateProfile from "./routes/Pages/UpdateProfile";
import ActivityPage from "./routes/Pages/ActivityPage";
import DepositWithdrawPage from "./routes/Pages/DepositWithdrawPage";
import ManualDeposits from "./routes/Pages/ManualDeposits";
import MyTransactions from "./routes/Pages/MyTransactions";
import ComingSoon from "./routes/Pages/ComingSoon";
import ManualWithdrawals from "./routes/Pages/ManualWithdrawals";
import MyWithdrawalHistory from "./routes/Pages/MyWithdrawalHistory";
import MyDepositHistory from "./routes/Pages/MyDepositHistory";
import ColorGame from "./routes/Pages/ColorGame";
import Page from "./routes/dashboard/page";
import DepositDetails from "./routes/Pages/DepositDetails";
import AddMoneyUser from "./routes/Pages/AddMoneyUser";
import AddMoneyPage from "./routes/Pages/AddMoneyPage";
import TimerSettingsPage from "./routes/Pages/TimerSettingPage";


function App() {
    const router = createBrowserRouter([
        {
            path: '/home',
            element: <Home />
        },


        {
            path: "/",
            element: <SplashScreen />,
        },
        {
            path: "/mytransactions",
            element: <MyTransactions />,
        },
        {
            path: "/mywithdrawals",
            element: <MyWithdrawalHistory />,
        },
        {
            path: "/mydeposits",
            element: <MyDepositHistory />,
        },
        {
            path: "/activity",
            element: <ActivityPage />,
        },
        {
            path: "/depositwithdeaw/:type/:userId",
            element: <DepositWithdrawPage />,
        },

        {
            path: "/admin/login",
            element: <Login />,
        },
        {
            path: "/user/login",
            element: <UserLogin />,
        },
        {
            path: "/signup",
            element: <UserSignup />,
        },
        {
            path: "/comingsoon",
            element: <ComingSoon />,
        },
        {
            path: "/user/account/:id",
            element: <Account />,
        },
        {
            path: "/myhistory",
            element: <MyHistory />,
        },
        {
            path: "/updateprofile/:id",
            index: true,
            element: <UpdateProfile />,
        },
        {
            path: "/game/colorpridiction",
            element: <ColorGame />,
        },
        {
            path: "/walletpage",
            index: true,
            element: <WalletPage />,
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                    path: "/dashboard",
                    index: true,
                    element: <Page />,
                },
                {
                    path: "/Manageuser",
                    index: true,
                    element: <ManageUser />,
                },
                {
                    path: "/setting",
                    index: true,
                    element: <AdminSettingsPage />,
                },

                {
                    path: "/editprofile/:id",
                    index: true,
                    element: <EditProfile />,
                },


                {
                    path: "/manageresult/declare",
                    index: true,
                    element: <DeclareResult />,
                },

                {
                    path: "/manageresult/all",
                    index: true,
                    element: <AllResults />,
                },
                {
                    path: "/manage-referrals",
                    index: true,
                    element: <ManageReferrals />,
                },
                {
                    path: "/depositdetail/:transactionId",
                    element: <DepositDetails />,
                },
                {
                    path: "/manualdeposits",
                    index: true,
                    element: <ManualDeposits />,
                },
                {
                    path: "/timersetting",
                    index: true,
                    element: <TimerSettingsPage />,
                },
                {
                    path: "/admin/add-money",
                    index: true,
                    element: <AddMoneyPage />,
                },
                {
                    path: "/addmoneyuser",
                    index: true,
                    element: <AddMoneyUser />,
                },
                {
                    path: "/manualwithdrawals",
                    index: true,
                    element: <ManualWithdrawals />,
                },

                {
                    path: "/Alltransaction",
                    index: true,
                    element: <ManageTransactions />,
                },
                {
                    path: "/managebets",
                    index: true,
                    element: <ManageBets />,
                },
                {
                    path: "/addbanner",
                    index: true,
                    element: <AddBanner />,
                },

                {
                    path: "/editbanner/:id",
                    index: true,
                    element: <EditBanner />,
                },
                {
                    path: "/managebanner",
                    index: true,
                    element: <ManageBanner />,
                },
            ],
        },
    ]);

    return (
        <HelmetProvider>
            <ThemeProvider storageKey="theme">
                <RouterProvider router={router} />
            </ThemeProvider>
        </HelmetProvider>
    );
}

export default App;
