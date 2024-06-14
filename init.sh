#!/bin/sh
npx prisma migrate dev
npx prisma db execute --file ./init_script.sql --schema prisma/schema.prisma
