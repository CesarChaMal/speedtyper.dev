import React, { useState } from "react";
import useUserResults from "../../hooks/useUserResults";
import { humanizeRelative, humanizeAbsolute } from "../../utils/humanize";
import SecondChart from "../../components/SecondChart";
import { useRouter } from "next/router";

interface ProfileProps {
  userName?: string;
}

const ProfileItem = ({
  children,
}: {
  children: React.ReactChild;
  customWidth?: string;
}) => {
  return (
    <div className="flex items-center justify-between bg-dark-ocean text-off-white p-2 mr-6 mb-4 w-56 rounded-xl shadow-lg">
      {children}
    </div>
  );
};

export type ResultSelectorType = "monthly" | "annual";

const ProfilePage = (props: ProfileProps) => {
  const router = useRouter();
  const { username } = router.query;

  // TODO: handle Nextjs query being of type string | string[] | undefined
  const userResults = useUserResults(username);

  const [resultSelector, setResulSelector] = useState(
    "monthly" as ResultSelectorType
  );

  if (!userResults) {
    return null;
  }

  const challengeResults = userResults[resultSelector];

  return userResults ? (
    <div className="flex text-off-white items-center justify-center h-full tracking-wider">
      <div className="flex items-center flex-col">
        <div className="flex flex-wrap items-center">
          <ProfileItem>
            <div className="p-4 flex-row">
              <div className="pb-2 text-sm">Username:</div>
              <div className="text-xl">{username}</div>
            </div>
          </ProfileItem>
          <ProfileItem>
            <div className="p-4 flex-row">
              <div className="pb-2 text-sm">Member for:</div>
              <div className="text-xl">
                {humanizeAbsolute(new Date(userResults.createdAt))}
              </div>
            </div>
          </ProfileItem>
          <ProfileItem>
            <div className="p-4 flex-row">
              <div className="pb-2 text-sm">Time played:</div>
              <div className="text-xl">
                {humanizeRelative(userResults.totalSecondsPlayed * 1000)}
              </div>
            </div>
          </ProfileItem>
          <ProfileItem>
            <div className="p-4 flex-row">
              <div className="pb-2 text-sm">Games played:</div>
              <div className="text-xl">{userResults.gamesPlayed}</div>
            </div>
          </ProfileItem>
        </div>
        <div className="max-w-5xl w-full bg-dark-ocean items-center mt-4 pt-2 text-lg text-off-white font-light rounded-md text-white">
          <div className="flex flex-row">
            <h1 className="text-xl px-8 py-4 font-bold">Progress (WPM)</h1>
            <div className="text-sm"></div>
            <button
              className={`font-bold my-4 outline-none border-none ${
                resultSelector === "monthly"
                  ? "text-purple-200"
                  : "text-off-white"
              }`}
              style={{
                outline: "none",
              }}
              onClick={() => setResulSelector("monthly")}
            >
              30 days
            </button>
            <button
              className={`font-bold m-4 mr-8 ${
                resultSelector === "annual"
                  ? "text-purple-200"
                  : "text-off-white"
              }`}
              style={{
                outline: "none",
              }}
              onClick={() => setResulSelector("annual")}
            >
              12 months
            </button>
          </div>
          <SecondChart
            challengeResults={challengeResults}
            resultSelector={resultSelector}
          />
        </div>
      </div>
    </div>
  ) : null;
};

export default ProfilePage;
