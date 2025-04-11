"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { TopBar } from "../components/TopBar";
import { useAptosName } from "../hooks/useAptosName";
import { ProfileEditor } from "../components/ProfileEditor";
import { useEffect, useState } from "react";
import { Profile } from "@/types";
import { fetchBioAndLinks } from "@/app/api/util.ts";
import Link from "next/link";

export default function Home() {
  const { connected, account } = useWallet();
  const router = useRouter();
  const { ansName, loading: ansLoading } = useAptosName();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!account?.address) {
        setLoaded(false);
        setLoading(false);
        return;
      }

      if (!loaded) {
        setLoading(true);
      }
      try {
        const [bio, links] = await fetchBioAndLinks(account.address);

        if (bio?.error || !bio) {
          console.log("Bio fetch error:", bio.error);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Create profile object
        const profileData: Profile = {
          owner: account.address.toString(),
          ansName: ansName,
          name: bio.name || ansName!,
          profilePicture: bio.avatar_url || "",
          description: bio.bio || "",
          title: bio.name || "",
          links: Array.isArray(links) ? links : [],
        };

        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } finally {
        setLoaded(true);
        setLoading(false);
      }
    };
    if (connected && account?.address) {
      fetchProfile().then(() => {
      });
    } else {
      setLoaded(true);
      setLoading(false);
    }
  }, [connected, account?.address, ansName, loaded]);

  const handleViewProfile = async () => {
    if (connected) {
      if (loading || ansLoading) {
        return;
      }
      if (ansName) {
        router.push(`/${ansName}`);
      } else {
        console.log("No ANS name found for this wallet");
      }
    }
  };

  const handleLoading = () => {
    if (loading || ansLoading) {
      return <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white text-center">Loading profile...</h1>
      </div>;
    }

    if (ansName === null || ansName === undefined) {
      return (
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-white text-center">Get an Aptos Name</h1>
          <div className="text-white text-center">
            <Link 
              href={"https://aptosnames.com"} 
              target="_blank" 
              className="flex text-center items-center justify-center gap-1 hover:underline"
            >
              Profiles can only be created with ANS Names. 
              <br className="hidden sm:block" />
              Go grab one on Aptos Names and set it as your primary name
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-white text-center">Edit Your Profile</h1>
        <ProfileEditor ansName={ansName} profile={profile || undefined} onViewProfile={handleViewProfile}
                       loading={loading || ansLoading} />
      </div>
    );
  };

  return (
    <>
      <TopBar />
      <main
        className="min-h-screen bg-gradient-to-b from-[#D8B4FE] to-[#818CF8] flex items-center justify-center pt-16">
        <div className="w-full max-w-[680px] mx-auto px-4">
          {!connected ? (
            <div className="flex flex-col items-center gap-6 relative">
              <div className="fixed top-16 right-24 flex items-center text-white">
                <span className="text-lg mr-2">Connect Here</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="animate-bounce"
                >
                  <path
                    d="M12 5L12 19M12 5L5 12M12 5L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-white mb-3">My Hackathon Project</h1>
              <h2 className="text-2xl text-white/90 mb-6">Your Gateway to Building on Aptos</h2>
              
              <div className="flex flex-col items-center gap-6">
                <p className="text-white/80 text-center text-lg max-w-md">
                  Connect your wallet to start building your next great idea on Aptos. An easy way to jumpstart your hackathon project.
                </p>
                
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium shadow-lg hover:bg-purple-50 transition-colors"
                    onClick={() => (document.querySelector('.wallet-selector-button') as HTMLElement)?.click()}
                  >
                    Connect Wallet
                  </button>
                  
                  <button
                    className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                    onClick={() => (document.querySelector('.how-to-use-button') as HTMLElement)?.click()}
                  >
                    How to Use
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quick Start</h3>
                  <p className="text-white/80">Fork this repo to jumpstart your hackathon project with everything you need</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                  <div className="text-3xl mb-3">🔗</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Resource Hub</h3>
                  <p className="text-white/80">Access all the essential resources for Aptos development in one place</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Learn as You Build</h3>
                  <p className="text-white/80">Discover Aptos ecosystem components through interactive guides</p>
                </div>
              </div>
            </div>
          ) : (
          handleLoading()
            )}
        </div>
      </main>
    </>
  );
}
