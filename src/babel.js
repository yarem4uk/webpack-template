const start = async () => {
  await Promise.resolve('async is working')
}

start().then((body) => console.log(body))

class Util {
  static id = Date.now()
}

console.log('Util id:', Util.id)
