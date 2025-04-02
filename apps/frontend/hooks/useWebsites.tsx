"use client"

import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
  id: string;
  name: string;
  url: string;
  ticks: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export function useWebsites() {
  const { getToken } = useAuth();
  const [websites, setWebsites] = useState<Website[]>([]);
   async function refreshWebsites() {
    const token = await getToken();
    const response = await axios.get(`${BACKEND_URL}/api/v1/websites`, {
      headers: {
        Authorization: token,
      },
    });
    setWebsites(response.data.websites);
   }

  useEffect(() => {
    refreshWebsites();

    const interval = setInterval(() => {
      refreshWebsites();
    }, 1000 * 60 * 5);          //kyuki tickets and all will keep on changing in the websites so we are gathering them again and again.

    return () => clearInterval(interval);
  }, []);

  return {
    websites,
    refreshWebsites,
  };
}
