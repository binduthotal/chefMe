const menuItems = [
  "Dashboard",
  "Recipes",
  "Shopping List",
  "Favorites",
  "Your Profile"
];

const currentUser = {
  name: "Chef Maya",
  email: "maya@mechef.app",
  role: "Logged in user",
};

const Home = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#eef2ff_38%,_#fef9c3_100%)] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-7xl flex-col overflow-hidden rounded-[32px] border border-violet-100 bg-white/85 shadow-[0_24px_80px_rgba(79,70,229,0.14)] backdrop-blur">
        <header className="flex gap-4 border-b border-indigo-100 px-5 py-5 sm:px-8 sm:justify-between  lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-indigo-500 to-sky-400 shadow-lg shadow-indigo-200/70">
              <span className="text-lg font-black tracking-[0.28em] text-white">
                Me
              </span>
            </div>

            <div>
              <h1 className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-500">
                me The Chef
              </h1>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                save your recipie
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-indigo-100 bg-indigo-50/80 px-4 py-3 lg:self-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-950 text-sm font-bold text-white">
              {currentUser.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row">
          <aside className="border-b border-indigo-100 bg-slate-950 px-5 py-6 text-white lg:w-72 lg:border-r lg:border-b-0 lg:px-6">
            <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-300">
                Hello
              </p>
              <h2 className="mt-1 text-xl font-bold">{currentUser.name}</h2>
              {/* <p className="mt-1 text-sm text-slate-300">{currentUser.role}</p> */}
            </div>

            <nav className="mt-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Menu
              </p>

              <div className="space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = index === 0;

                  return (
                    <button
                      key={item}
                      type="button"
                      className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-linear-to-r from-violet-500 via-indigo-500 to-sky-400 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <span>{item}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isActive ? "bg-yellow-300" : "bg-sky-300/60"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          <section className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold uppercase tracking-[0.26em] text-indigo-500">
                Welcome
              </p>
              {/* <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Hello, {currentUser.name}
              </h2> */}
              <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Create, Add, Save and share your recipie with your loved ones...
              </p>
            </div>

            <div className="mt-8 flex min-h-[420px] items-center justify-center rounded-[28px] border-2 border-dashed border-indigo-200 bg-[linear-gradient(135deg,rgba(245,243,255,0.96),rgba(239,246,255,0.94),rgba(254,249,195,0.88))] p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-indigo-500 to-sky-400 text-white shadow-xl shadow-indigo-500/20">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 7h16" />
                    <path d="M7 4v6" />
                    <path d="M17 4v6" />
                    <path d="M5 11h14v8H5z" />
                  </svg>
                </div>

                <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">
                  Add Recipie
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  No cards or data have been added yet. This space is prepared
                  for your future dashboard content.
                </p>

                <button
                  type="button"
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-violet-500 via-indigo-500 to-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 text-xs font-bold text-indigo-950">
                    +
                  </span>
                  Add Recipe
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Home;
