"use client";

const ClientWrapper: React.FC<{
  children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
  return <>{children}</>;
};

export default ClientWrapper;
