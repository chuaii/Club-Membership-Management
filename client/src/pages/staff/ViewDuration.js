import {Breadcrumb, Card} from 'antd'
import React from 'react'
import {Link} from "react-router-dom";


export default function ViewDuration() {
    return (
        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Membership Duration</Breadcrumb.Item>
                </Breadcrumb>
            }
            style={{marginBottom: 20}}
        >
            <h2>Membership Duration</h2>
            <p>This feature is under development.</p>
        </Card>
    )
}
