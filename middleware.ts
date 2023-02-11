import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import next from "next";
import express from "express";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const upload = multer();

export function middleware(request: NextRequest) {
  return NextResponse.next({
    request: {},
  });
}

export const config = {
  matcher: ["/:userId/:layerId/uploadImages"],
};
