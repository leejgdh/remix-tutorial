import { json, LinksFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSubmit,
} from "@remix-run/react";
import appStylesHref from "./app.css?url";


import { createEmptyContact, getContacts } from "./data";
import { useEffect, useState } from "react";
import { FirebaseProvider } from "./auth/firebase-context";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];


export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts, q });
};


export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
  //return json({ contact });
};

export default function App() {

  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  // the query now needs to be kept in state
  const [query, setQuery] = useState(q || "");


  // we still have a `useEffect` to synchronize the query
  // to the component state on back/forward button clicks
  useEffect(() => {
    setQuery(q || "");
  }, [q]);

  // useEffect(() => {
  //   const searchField = document.getElementById("q");
  //   if (searchField instanceof HTMLInputElement) {
  //     searchField.value = q || "";
  //   }
  // }, [q]);



  return (
    <FirebaseProvider>

      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div id="sidebar">
            <h1>Remix Contacts</h1>
            <div>
              <Form id="search-form" role="search"
                onChange={(event) => {
                  const isFirstSearch = q === null;
                  submit(event.currentTarget, {
                    replace: !isFirstSearch,
                  });
                }}>
                <input
                  id="q"
                  defaultValue={q || ""}
                  aria-label="Search contacts"
                  placeholder="Search"
                  type="search"
                  name="q"
                  onChange={(event) =>
                    setQuery(event.currentTarget.value)
                  }
                  className={searching ? "loading" : ""}
                  value={query}
                />
                <div id="search-spinner" aria-hidden
                  hidden={!searching} />
              </Form>
              <Form method="post">
                <button type="submit">New</button>
              </Form>
            </div>
            <nav>
              {contacts.length ? (
                <ul>
                  {contacts.map((contact) => (
                    <li key={contact.id}>
                      <NavLink
                        className={({ isActive, isPending }) =>
                          isActive
                            ? "active"
                            : isPending
                              ? "pending"
                              : ""
                        }
                        to={`contacts/${contact.id}`}
                      >
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? (
                          <span>★</span>
                        ) : null}

                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  <i>No contacts</i>
                </p>
              )}
            </nav>
          </div>
          <div
            className={
              navigation.state === "loading" && !searching
                ? "loading"
                : ""
            }
            id="detail">
            <Outlet />
          </div>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </FirebaseProvider>
  );
}


// custom error page
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}