({
    baseUrl : "../../",
    mainConfigFile: "./boot.js",
    name: "./client/dashboard/boot",
    out: "build/seevcam.min.js",
    optimize: "none",
    findNestedDependencies: true,
    paths: {
    requireLib: 'bower_components/requirejs/require'
    },
    include: ["requireLib"]
})