'use client'; // onClick need Client Component

import { Fragment } from "react";
import styles from "./sign-in.module.css";

import { signInWithGoogle, signOut } from "@/lib/firebase";
import { User } from "firebase/auth";

interface SignInProps {
    user: User | null;
}

export default function SignIn({ user }: SignInProps) {
    return (
        <Fragment>
            { user ?
                (
                    <button className={styles.signin} onClick={signOut}>
                        Sign out
                    </button>
                ) : (
                    <button className={styles.signin} onClick={signInWithGoogle}>
                        Sign in 
                    </button>
                )
            }
        </Fragment>
    )
}