import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Page from '../app/page'
import prisma from '@/utils/prisma'

// hello world
test("hello world", () => {
    expect("hello world").toEqual("hello world")
})

// TODO: delete user

// TODO: update role 
