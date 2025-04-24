"use client"; // to use useState and useEffect

import Image from "next/image";
import styles from "./navbar.module.css"

import SignIn from "./sign-in";
import Link from "next/link";

import { useState, useEffect } from "react";
import { onAuthStateChangedHelper } from "@/lib/firebase";
import { User } from "firebase/auth";
import Upload from "./upload";


export default function Navbar() {
    // Init user state as null, setUser is a function to update the user status
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => { setUser(user); });
        // console.log(typeof unsubscribe); // "function"
        // cleanup function, cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <Image width={90} height={60}
                    src="/favicon.svg" alt="YouTube Logo"/>
            </Link>
            {
                user && <Upload /> // if the user signed out(null), they can't upload video
            }
            <SignIn user={user}/>
        </nav>
    );
}