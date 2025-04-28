/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useHelperContext } from '@/components/providers/helper-provider';
import { isErrorResponse } from '@/types/request';
import React, { useEffect } from 'react'

export default function Page() {
    const { searchParams, backendClient, setFullLoading } = useHelperContext()();
    const token = searchParams.get("token");

    useEffect(() => {
        if (token) {
            loginWithToken(token);
        }
    }, [token]);

    const loginWithToken = async (token: string) => {
        setFullLoading(true);
        const response = await backendClient.loginWithToken(token);
        if (isErrorResponse(response)) {
            return;
        }

        window.location.href = "/";
    }

  return (
    <div></div>
  )
}
