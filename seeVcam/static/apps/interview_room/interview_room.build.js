({
    baseUrl : "../../",
    mainConfigFile: "./boot.js",
    name: "./lib/dashboard/boot",
    out: "build/seevcam.min.js",
    optimize: "none",
    findNestedDependencies: true,
    paths: {
    requireLib: 'bower_components/requirejs/require'
    },
    include: ["requireLib"]
})