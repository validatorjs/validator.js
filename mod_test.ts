import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { validator } from "./mod.ts";
import isEmail from "./deno/lib/isEmail.js";

Deno.test("validator:isEmail", () => {
  assertEquals(validator.isEmail("email@example.com"), true);
  assertEquals(isEmail("email@example.com"), true);

  assertEquals(validator.isEmail("email"), false);
  assertEquals(isEmail("email"), false);
})
