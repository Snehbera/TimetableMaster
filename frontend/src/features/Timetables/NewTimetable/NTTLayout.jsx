import React from "react";
import { Outlet } from "react-router-dom";
import NTTHeader from "components/NTTHeader/NTTHeader";

function NTTLayout() {
  return (
    <div className="ntt-layout-container">
      <NTTHeader />
      <Outlet />
    </div>
  );
}

export default NTTLayout;
