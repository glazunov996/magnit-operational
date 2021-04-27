export default async function(func, name) {
  console.log(name + " STARTED")
  const now = Date.now()
  const result =  await func;
  console.log(name + " FINISHED in ", Date.now() - now);
  return result;
}