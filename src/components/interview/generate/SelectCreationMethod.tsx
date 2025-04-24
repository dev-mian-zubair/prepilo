import React from "react";

import { CustomRadio } from "@/components/CustomRadio";
import { InterviewType } from "@/enums";

const SelectCreationMethod = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <CustomRadio
          className="bg-background border border-divider rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] data-[selected=true]:border-primary"
          description="Fill out a form to customize questions and settings for your interview."
          value={InterviewType.manually}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl transition-colors">📝</span>
            <span className="text-lg font-semibold">Create Manually</span>
          </div>
        </CustomRadio>
        <CustomRadio
          className="bg-background border border-divider rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] data-[selected=true]:border-primary"
          description="Answer questions from our AI agent to generate a tailored interview."
          value={InterviewType.agent}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl transition-colors">✨</span>
            <span className="text-lg font-semibold">Create with AI Agent</span>
          </div>
        </CustomRadio>
      </div>
      <CustomRadio
        className="bg-background border border-divider rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] data-[selected=true]:border-primary"
        description="Provide a job description, and our AI will craft a customized interview."
        value={InterviewType.byJd}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl transition-colors">📋</span>
          <span className="text-lg font-semibold">
            Create from Job Description
          </span>
        </div>
      </CustomRadio>
    </div>
  );
};

export default SelectCreationMethod;
