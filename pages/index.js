import Jobs from "components/Jobs";
import prisma from "lib/prisma";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getJobs, getUser } from "lib/data.js";
import Link from "next/link";

export default function Home({ jobs, user }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (session && !session.user.name) {
    router.push("/setup");
  }
  return (
    <div className="mt-10">
      <div className="mt-10 text-center">
        {!session && (
          <a
            className="border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black "
            href="/api/auth/signin"
          >
            login
          </a>
        )}
      </div>
      <div className="text-center p-4 m-4">
        {session && (
          <>
            <p className="mb-10 text-2xl font-normal">
              Welcome, {user.name}
              {user.company && (
                <span className="bg-black text-white uppercase text-sm p-2">
                  Company
                </span>
              )}
            </p>
            {user.company ? (
              <>
                <Link href={`/new`}>
                  <button className="border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black ">
                    click here to post a new job
                  </button>
                </Link>
                <Link href={`/dashboard`}>
                  <button className="ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black ">
                    see all the jobs you posted
                  </button>
                </Link>
              </>
            ) : (
              <Link href={`/dashboard`}>
                <button className="ml-5 border px-8 py-2 mt-5 font-bold rounded-full bg-black text-white border-black ">
                  see all the jobs you applied to
                </button>
              </Link>
            )}
          </>
        )}
        <h2 className="mb-10 text-4xl font-bold">Find a job!</h2>
      </div>
      <Jobs jobs={jobs} />
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let jobs = await getJobs(prisma);
  jobs = JSON.parse(JSON.stringify(jobs));

  if (!session) {
    return {
      props: { jobs },
    };
  }

  let user = await getUser(session.user.id, prisma);
  user = JSON.parse(JSON.stringify(user));

  return {
    props: {
      jobs,
      user,
    },
  };
}
