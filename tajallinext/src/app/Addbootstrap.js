"use client";

import { useEffect } from "react";

export default function AddBootstrap()
{
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min')
          .then(() => console.log("Bootstrap JS Loaded"))
          .catch((err) => console.error("Bootstrap JS Load Error:", err));
      }, []);
    return <></>
}