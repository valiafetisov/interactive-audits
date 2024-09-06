import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 lg:mb-0 flex justify-center gap-2 items-center">
      <p className="m-0 text-center">
        Built with <HeartIcon className="inline-block h-4 w-4" /> at
      </p>
      <a
        className="flex justify-center items-center gap-1"
        href="https://github.com/valiafetisov/interactive-audits"
        target="_blank"
        rel="noreferrer"
      >
        <span className="link">On-chain Audit</span>
      </a>
    </div>
  );
};
