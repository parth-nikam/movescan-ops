import {QueryClient,QueryClientProvider} from "@tanstack/react-query";import {Stack} from "expo-router";import {useState} from "react";
export default function Layout(){const[client]=useState(()=>new QueryClient({defaultOptions:{mutations:{retry:false}}}));return <QueryClientProvider client={client}><Stack screenOptions={{headerShown:false}}/></QueryClientProvider>}
