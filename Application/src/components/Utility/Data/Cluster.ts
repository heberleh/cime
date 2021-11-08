import * as THREE from 'three'
import { Vect } from "./Vect"

export default class Cluster {
    points: Array<any>
    label: any
    bounds: any
    hull: any
    triangulation: any
    vectors: Vect[]
    name: string

    constructor(points, bounds?, hull?, triangulation?) {
        this.points = points
        this.bounds = bounds
        this.hull = hull
        this.triangulation = triangulation
    }


    static calcBounds(samples: Vect[]) {
        // Get rectangle that fits around data set
        var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
        samples.forEach(sample => {
          minX = Math.min(minX, sample.x)
          maxX = Math.max(maxX, sample.x)
          minY = Math.min(minY, sample.y)
          maxY = Math.max(maxY, sample.y)
        })
      
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            left: minX,
            top: minY,
            right: maxX,
            bottom: maxY
        }
    }


    static fromSamples(samples: Vect[]) {
        let cluster = new Cluster(samples.map(sample => ({
            x: sample.x,
            y: sample.y,
            meshIndex: sample.view.meshIndex
        })))

        cluster.vectors = samples
        cluster.label = Math.floor(Math.random() * 1000)
        cluster.bounds = Cluster.calcBounds(samples)

        return cluster
    }



        /**
     * Resets the labeling for given vectors based on given clusters
     * 
     * @param vectors The vectors to relabel
     * @param clusters The clusters to take the label from
     */
    static deriveVectorLabelsFromClusters(vectors: Vect[], clusters: Cluster[]) {
        // Clear all cluster labels from vectors
        vectors.forEach(vector => {
            vector.groupLabel = []
        })

        // Create new labels from clusters
        clusters.forEach(cluster => {
            cluster.vectors.forEach(vector => {
                vector.groupLabel.push(cluster.label)
            })
        })
    }


    containsPoint(coords) {
        var x = coords.x
        var y = coords.y
        if (x > this.bounds.minX && x < this.bounds.maxX && y < this.bounds.maxY && y > this.bounds.minY) {
            return true
        }

        return false
    }

    getCenter() {
        var x = 0
        var y = 0

        this.vectors.forEach(p => {
            x = x + p.x
            y = y + p.y
        })

        return {
            x: x / this.vectors.length,
            y: y / this.vectors.length
        }
    }

    getCenterAsVector2() {
        let center = this.getCenter()
        return new THREE.Vector2(center.x, center.y)
    }

    differentLines() {
        return [...new Set(this.vectors.map(v => v.view.segment.lineKey))].length
    }

    getTextRepresentation() {
        if (this.name) {
            return `${this.label} / ${this.name}`
        } else {
            return "" + this.label
        }
    }
}