"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/Redux/hooks";
import { fetchMe } from "@/Redux/authSlice";

export default function AuthHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return null;
}